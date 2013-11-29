<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Infect\BackendBundle\Entity\SubstanceClass;
use Infect\BackendBundle\Entity\SubstanceClassLocale;
use Infect\BackendBundle\Form\SubstanceClassType;

/**
 * SubstanceClass controller.
 *
 */
class SubstanceClassController extends Controller
{

    /**
     * Lists all SubstanceClass entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        //$entities = $em->getRepository('InfectBackendBundle:SubstanceClass')->findAll();

        $entities = $em->createQueryBuilder()
                            ->select(array('node', '(COUNT(parent.id) - 1) AS depth'))
                            ->from('InfectBackendBundle:SubstanceClass', 'node')
                            ->from('InfectBackendBundle:SubstanceClass', 'parent')
                            ->where('node.lft BETWEEN parent.lft AND parent.rgt')
                            ->groupBy('node.id')
                            ->orderBy('node.lft')
                            ->getQuery()->getResult();

        $results = array();
        foreach($entities as $entity)
        {
            $result = $entity[0];
            $result->setDepth((int)$entity['depth']);

            $results[] = $result;
        }

        return $this->render('InfectBackendBundle:SubstanceClass:index.html.twig', array(
            'entities' => $results,
        ));
    }
    /**
     * Creates a new SubstanceClass entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity  = new SubstanceClass();
        $form = $this->createForm(new SubstanceClassType(), $entity);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
                        $locales = array();
            foreach ($entity->getLocales() as $locale) 
            {
                $locales[] = $locale;
                $entity->removeLocale($locale);
            }

            $em->persist($entity);
            $em->flush();

            foreach($locales as $locale)
            {
                $entity->addLocale($locale);
                $em->persist($locale);
            }
            $em->flush();

            return $this->redirect($this->generateUrl('substanceclass_show', array('id' => $entity->getId())));
        }

        return $this->render('InfectBackendBundle:SubstanceClass:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Displays a form to create a new SubstanceClass entity.
     *
     */
    public function newAction()
    {
        $entity = new SubstanceClass();
        $entity->addLocale(new SubstanceClassLocale());
        $form   = $this->createForm(new SubstanceClassType(), $entity);

        return $this->render('InfectBackendBundle:SubstanceClass:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a SubstanceClass entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:SubstanceClass')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find SubstanceClass entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:SubstanceClass:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing SubstanceClass entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:SubstanceClass')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find SubstanceClass entity.');
        }

        $editForm = $this->createForm(new SubstanceClassType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:SubstanceClass:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing SubstanceClass entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:SubstanceClass')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find SubstanceClass entity.');
        }

        $originalLocales = array();
        foreach ($entity->getLocales() as $locale) {
            $originalLocales[] = $locale;
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new SubstanceClassType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            foreach ($entity->getLocales() as $locale) {
                foreach ($originalLocales as $key => $toDel) {
                    if ($toDel->getLanguage() === $locale->getLanguage() && $toDel->getSubstanceClass() === $locale->getSubstanceClass()) 
                    {
                        unset($originalLocales[$key]);
                    }
                }
            }
            foreach ($originalLocales as $locale) {
                $em->remove($locale);
            }

            $this->updateTree($entity);

            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('substanceclass_edit', array('id' => $id)));
        }

        return $this->render('InfectBackendBundle:SubstanceClass:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    private function updateTree($entity)
    {
        $em = $this->getDoctrine()->getManager();
        $conn = $em->getConnection();

        // how much to increase / decrerase the to be moced subtrees rigth & left
        $newParentLeft = $entity->getParent() ? $entity->getParent()->getLft() : 0;
        $gapOffset = ( $newParentLeft ) > $entity->getLft() ? ( $entity->getParent()->getLft() - $entity->getLft() - 1 ) : (( $entity->getLft() - $newParentLeft -1) * -1 );

        // how big is the subtrees range, so we can move all elements between the old & the new parent in the correponding direction
        $offset = $entity->getRgt() - $entity->getLft() + 1 ;

        var_dump($gapOffset);
        var_dump($offset);
        exit;

        $result_ids = $em->createQueryBuilder()
            ->select('s.id')
            ->from('InfectBackendBundle:SubstanceClass', 's')
            ->where('s.lft >= '.$entity->getLft())
            ->andWhere('s.rgt <= '.$entity->getRgt())
            ->getQuery()
            ->getArrayResult();

        $ids = array();
        foreach($result_ids as $id)
        {
            $ids[] = $id['id'];
        }

        if ( $gapOffset > 0 )
        {
            // move other nodes to the left, we always have a parent when the gapOffset is positive

            // move the left value
            $conn->executeUpdate('
                            UPDATE substanceClass s
                                SET
                                    s.lft = s.lft - ( CASE WHEN s.lft > ? THEN ? ELSE 0 END  ),
                                    s.rgt = s.rgt - ( CASE WHEN s.rgt < ? THEN ? ELSE 0 END  )
                                WHERE s.rgt > ?
                                AND s.lft <= ?'
                , array(
                    $entity->getRgt(),
                    $offset,
                    $entity->getParent()->getLft(),
                    $offset,
                    $entity->getRgt(),
                    $entity->getParent()->getLft(),
                )
            );

        }
        else
        {
            // move other nodes to the right
            $conn->executeUpdate('
                            UPDATE substanceClass s
                              SET
                                s.lft = s.lft + ( CASE WHEN s.lft < ? THEN ? ELSE 0 END  ),
                                s.rgt = s.rgt + ( CASE WHEN s.rgt > ? THEN ? ELSE 0 END  )
                              WHERE s.lft < ?
                              AND s.lft >= ?'
                , array(
                    $entity->getLft(),
                    $offset,
                    $entity->getParent()->getLft(),
                    $offset,
                    $entity->getLft(),
                    $entity->getParent() ? $entity->getParent()->getLft() : 0,
                )
            );
        }

        // move the subtree to the new location
        $conn->executeUpdate('
                            UPDATE substanceClass s
                              SET
                                s.lft = s.lft + ?,
                                s.rgt = s.rgt + ?
                              WHERE id IN (?)'
            , array(
                $gapOffset,
                $gapOffset,
                implode(',', $ids)
            )
        );
    }

    /**
     * Deletes a SubstanceClass entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('InfectBackendBundle:SubstanceClass')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find SubstanceClass entity.');
            }

            $hasChilds = ($entity->getRgt() - $entity->getLft()) > 1;

            if(!$hasChilds)
            {
                $em->remove($entity);
                $em->flush();
            }
            else
            {
                $translator = $this->get('translator');
                $message = $translator->trans(
                    '%entity% konnte nicht gelöscht werden, da untergeordnete SubstanceClassen vorhanden sind',
                    array(
                        '%entity%' => "SubstanceClass"
                    )
                );

                $request->getSession()->getFlashBag()->add('error', $message);

                return $this->redirect($this->generateUrl('substanceclass_edit', array('id' => $id)));
            }

        }

        return $this->redirect($this->generateUrl('substanceclass'));
    }

    /**
     * Creates a form to delete a SubstanceClass entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }
}
